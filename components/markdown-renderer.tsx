"use client"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Image from 'next/image'
import Link from 'next/link'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Element } from 'hast'
// import type { ReactMarkdownProps } from 'react-markdown/lib/complex-types'

interface MarkdownRendererProps {
  content: string
  className?: string
}

// Type for code component props
interface CodeProps {
  node?: Element
  inline?: boolean
  className?: string
  children: React.ReactNode
  [key: string]: any
}

// Type for other component props
interface ComponentProps {
  children: React.ReactNode
  [key: string]: any
}

// Type for image props
interface ImageProps {
  src?: string
  alt?: string
  [key: string]: any
}

// Type for link props
interface LinkProps {
  href?: string
  children: React.ReactNode
  [key: string]: any
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  // Use 'any' type for components to avoid type errors due to missing types
  const components: any = {
    // Custom heading components with anchor links
    h1: ({ children, ...props }: ComponentProps) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: ComponentProps) => (
      <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-100" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: ComponentProps) => (
      <h3 className="text-xl font-medium mt-5 mb-2 text-gray-700 dark:text-gray-200" {...props}>
        {children}
      </h3>
    ),
    
    // Custom paragraph styling
    p: ({ children, ...props }: ComponentProps) => (
      <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300" {...props}>
        {children}
      </p>
    ),

    // Custom link styling
    a: ({ href, children, ...props }: LinkProps) => {
      if (href?.startsWith('http')) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
            {...props}
          >
            {children}
          </a>
        )
      }
      return (
        <Link
          href={href || '#'}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
          {...props}
        >
          {children}
        </Link>
      )
    },

    // Custom image component
    img: ({ src, alt, ...props }: ImageProps) => {
      // Ensure src is a string and handle potential undefined values
      const safeSrc = typeof src === 'string' && src ? src : '/placeholder.svg'
      const safeAlt = alt || ''
      
      return (
        <div className="my-8">
          <Image
            src={safeSrc}
            alt={safeAlt}
            width={800}
            height={400}
            className="rounded-lg shadow-lg mx-auto"
            unoptimized={safeSrc.startsWith('/placeholder.svg')}
            {...props}
          />
          {alt && (
            <p className="text-center text-sm text-gray-500 mt-2 italic">{alt}</p>
          )}
        </div>
      )
    },

    // Custom code block with copy functionality
    code: ({ node, inline, className, children, ...props }: CodeProps) => {
      const match = /language-(\w+)/.exec(className || '')
      const codeString = String(children).replace(/\n$/, '')
      
      if (!inline && match) {
        return (
          <div className="relative my-6">
            <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2 rounded-t-lg">
              <span className="text-sm font-medium">{match[1]}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(codeString)}
                className="h-8 px-2 text-gray-300 hover:text-white hover:bg-gray-700"
              >
                {copiedCode === codeString ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <SyntaxHighlighter
              style={tomorrow}
              language={match[1]}
              PreTag="div"
              className="rounded-b-lg"
              {...props}
            >
              {codeString}
            </SyntaxHighlighter>
          </div>
        )
      }

      return (
        <code
          className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      )
    },

    // Custom blockquote styling
    blockquote: ({ children, ...props }: ComponentProps) => (
      <blockquote
        className="border-l-4 border-blue-500 pl-4 py-2 my-6 bg-blue-50 dark:bg-blue-900/20 italic text-gray-700 dark:text-gray-300"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Custom list styling
    ul: ({ children, ...props }: ComponentProps) => (
      <ul className="list-disc list-inside my-4 space-y-1 text-gray-600 dark:text-gray-300" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: ComponentProps) => (
      <ol className="list-decimal list-inside my-4 space-y-1 text-gray-600 dark:text-gray-300" {...props}>
        {children}
      </ol>
    ),

    // Custom table styling
    table: ({ children, ...props }: ComponentProps) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border border-gray-300 dark:border-gray-600" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }: ComponentProps) => (
      <th
        className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-4 py-2 text-left font-semibold"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: ComponentProps) => (
      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2" {...props}>
        {children}
      </td>
    ),
  }

  return (
    <div className={`prose prose-lg max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}