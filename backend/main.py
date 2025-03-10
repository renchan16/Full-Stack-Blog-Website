from fastapi import FastAPI, HTTPException, Query, Depends
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# FastAPI instance
app = FastAPI()

# CORS settings for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.31.136:3000", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Configuration
DATABASE_URL = "postgresql://newowner:newpassword@localhost/mydatabase"
engine = create_engine(DATABASE_URL)  # Creates database engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)  # Creates sessions
Base = declarative_base()  # Base class for database models

# Database Model for Posts
class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)  # Primary key with index
    title = Column(String, index=True)  # Indexed for faster search
    content = Column(Text)  # Content field for storing post data
    date_posted = Column(DateTime, server_default=func.now())  # Auto-set timestamp
    author_name = Column(String)  # Author's name

# Pydantic Schema for data validation
class PostSchema(BaseModel):
    title: str  # Title of the post
    content: str  # Content of the post
    author_name: str  # Name of the author

# Auto-create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Database Dependency for session management
def get_db():
    db = SessionLocal()  # Open database session
    try:
        yield db
    finally:
        db.close()  # Close session after request

# CRUD Operations

# Create Post endpoint
@app.post("/posts/", response_model=PostSchema)
def create_post(post: PostSchema, db: Session = Depends(get_db)):
    new_post = Post(**post.dict(), date_posted=datetime.now())  # Create new post
    db.add(new_post)  # Add to database
    db.commit()  # Save changes
    db.refresh(new_post)  # Refresh to get updated data
    return new_post

# Get all posts endpoint
@app.get("/posts/")
def get_posts(db: Session = Depends(get_db)):
    return db.query(Post).all()  # Return all posts

# Get single post by ID endpoint
@app.get("/posts/{post_id}")
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()  # Fetch post by ID
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

# Update Post endpoint
@app.put("/posts/{post_id}", response_model=PostSchema)
def update_post(post_id: int, post: PostSchema, db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == post_id).first()  # Fetch post by ID
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    for key, value in post.dict().items():
        setattr(db_post, key, value)  # Dynamically update fields
    db.commit()  # Save changes
    db.refresh(db_post)  # Refresh updated post data
    return db_post

# Delete Post endpoint
@app.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == post_id).first()  # Fetch post by ID
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(db_post)  # Delete post
    db.commit()  # Save changes
    return {"message": "Post deleted"}

# Search Posts endpoint
@app.get("/search/")
def search_posts(query: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    results = db.query(Post).filter(Post.title.ilike(f"%{query}%")).all()  # Search with partial match
    if not results:
        raise HTTPException(status_code=404, detail="No posts found")
    return results
