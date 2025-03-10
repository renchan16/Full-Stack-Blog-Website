"use client"

import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}

/**
 * Reusable empty state component for when there's no content to display
 */
export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      {icon && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">{description}</p>
      <Button onClick={onAction} className="bg-purple-600 hover:bg-purple-700 text-white mt-6">
        {actionLabel}
      </Button>
    </div>
  )
}

