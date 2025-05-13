import React, { useState, useEffect } from 'react';
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

interface Page {
  id: number;
  title: string;
  content: string;
}

interface Config {
  title: string;
  pages: Page[];
}

function App() {
  const [config, setConfig] = useState<Config>({ title: 'Documentation', pages: [] });
  const [currentPage, setCurrentPage] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/pages.toml')
      .then(response => response.text())
      .then(async text => {
        const TOML = await import('@iarna/toml');
        const data = TOML.parse(text);
        setConfig(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading pages:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    document.title = config.title;
  }, [config.title]);

  const nextPage = () => {
    if (currentPage < config.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="backdrop-blur-md bg-white/30 p-8 rounded-lg shadow-lg">
          <p className="text-white text-xl">Loading documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className="fixed top-0 left-0 right-0 z-10">
        <div className="backdrop-blur-md bg-white/30 p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">{config.title}</h1>
            <div className="w-6"></div>
          </div>
        </div>

        {menuOpen && (
          <div className="absolute top-full left-0 w-64 backdrop-blur-md bg-white/30 rounded-br-lg shadow-lg p-4">
            {config.pages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => {
                  setCurrentPage(index);
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                {page.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pt-20 px-4 pb-32 min-h-screen">
        <div className="max-w-4xl w-full mx-auto relative">
          <div className="backdrop-blur-md bg-white/30 p-8 rounded-lg shadow-lg">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-6" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-8 mb-4" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-6 mb-3" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                  li: ({node, ...props}) => <li className="mb-2" {...props} />,
                  code: ({node, inline, ...props}) => 
                    inline ? (
                      <code className="bg-white/10 rounded px-1" {...props} />
                    ) : (
                      <code className="block bg-white/10 rounded p-4 my-4 overflow-x-auto" {...props} />
                    ),
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-white/30 pl-4 my-4 italic" {...props} />
                  ),
                  a: ({node, ...props}) => (
                    <a className="text-blue-200 hover:text-blue-100 underline" {...props} />
                  ),
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full divide-y divide-white/20" {...props} />
                    </div>
                  ),
                  th: ({node, ...props}) => (
                    <th className="px-4 py-2 text-left font-semibold border-b border-white/20" {...props} />
                  ),
                  td: ({node, ...props}) => (
                    <td className="px-4 py-2 border-b border-white/20" {...props} />
                  ),
                }}
              >
                {config.pages[currentPage]?.content || ''}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-0 right-0 z-10">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          {currentPage > 0 ? (
            <button
              onClick={prevPage}
              className="backdrop-blur-md bg-white/30 p-4 rounded-lg shadow-lg text-white hover:bg-white/40 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="text-sm">{config.pages[currentPage - 1]?.title}</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentPage < config.pages.length - 1 ? (
            <button
              onClick={nextPage}
              className="backdrop-blur-md bg-white/30 p-4 rounded-lg shadow-lg text-white hover:bg-white/40 transition-colors flex items-center gap-2"
            >
              <span className="text-sm">{config.pages[currentPage + 1]?.title}</span>
              <ChevronRight className="w-6 h-6" />
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;