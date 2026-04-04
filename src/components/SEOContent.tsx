interface SEOContentProps {
  children: React.ReactNode;
}

export default function SEOContent({ children }: SEOContentProps) {
  return (
    <article className="mt-10 border-t border-gray-200 pt-8 dark:border-gray-800">
      <div className="prose prose-sm prose-gray max-w-none dark:prose-invert prose-headings:font-bold prose-h2:text-lg prose-h3:text-base prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-li:text-gray-600 dark:prose-li:text-gray-400">
        {children}
      </div>
    </article>
  );
}
