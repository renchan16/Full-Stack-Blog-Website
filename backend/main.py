from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI()

# CORS settings (adjust IP to match your frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.31.136:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database config (adjust credentials/db name if needed)
DATABASE_URL = "postgresql://newowner:newpassword@localhost/mydatabase"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# DB Model
class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String)
    date_posted = Column(DateTime, server_default=func.now())
    author_name = Column(String)

# Pydantic Schema (expects JSON payload)
class PostSchema(BaseModel):
    title: str
    content: str
    author_name: str

# Auto-create tables (only creates if not exist)
Base.metadata.create_all(bind=engine)

# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create post (accepts JSON body)
@app.post("/posts/")
def create_post(post: PostSchema, db: Session = Depends(get_db)):
    new_post = Post(
        title=post.title,
        content=post.content,
        author_name=post.author_name,
        date_posted=datetime.now()  # optional; DB default also works
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

# Fetch all posts
@app.get("/posts/")
def get_posts(db: Session = Depends(get_db)):
    return db.query(Post).all()

# Fetch single post by ID
@app.get("/posts/{post_id}")
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

# Update post (expects JSON body)
@app.put("/posts/{post_id}")
def update_post(post_id: int, post: PostSchema, db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    db_post.title = post.title
    db_post.content = post.content
    db_post.author_name = post.author_name
    db.commit()
    db.refresh(db_post)
    return db_post

# Delete post
@app.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(db_post)
    db.commit()
    return {"message": "Post deleted"}
