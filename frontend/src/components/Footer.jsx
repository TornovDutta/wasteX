import React from 'react';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary border-t border-gray-800 text-textmain/80 pt-16 pb-8">
      <div className="box-border mx-auto w-[1300px] max-w-full px-5 lg:px-16 border-x border-gray-800 border-dashed relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-accent" />
              <span className="font-bold text-xl text-textmain tracking-tight">WasteX</span>
            </Link>
            <p className="text-sm text-textmuted leading-relaxed">
              India's largest B2B waste network. We are building the infrastructure for a sustainable circular economy.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-textmain mb-4 tracking-tight">Platform</h4>
            <ul className="space-y-2 text-sm text-textmuted">
              <li><Link to="/" className="hover:text-accent transition-colors">Marketplace</Link></li>
              <li><Link to="/create" className="hover:text-accent transition-colors">List Waste</Link></li>
              <li><a href="#process" className="hover:text-accent transition-colors">How it works</a></li>
              <li><a href="#benefits" className="hover:text-accent transition-colors">Benefits</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-textmain mb-4 tracking-tight">Company</h4>
            <ul className="space-y-2 text-sm text-textmuted">
              <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-textmain mb-4 tracking-tight">Connect</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="text-textmuted hover:text-accent transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-textmuted hover:text-accent transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-textmuted hover:text-accent transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <p className="text-xs text-textmuted">
              Subscribe to our newsletter for the latest in circular economy.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-textmuted">
          <p>© {new Date().getFullYear()} WasteX. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-textmain transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-textmain transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-textmain transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
