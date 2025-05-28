// FILE: src/App.jsx
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import AppRouter from './router/AppRouter';
import i18n from './i18n';

// This is your main App component that wraps everything
function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <div className="App">
        <AppRouter />
        
        {/* Global styles */}
        <style jsx global>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html, body {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            font-size: 16px;
            line-height: 1.5;
            color: #333;
            background-color: #ffffff;
          }

          #root {
            min-height: 100vh;
          }

          .App {
            min-height: 100vh;
            width: 100%;
          }

          /* Container utilities */
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }

          /* Responsive utilities */
          @media (max-width: 768px) {
            .container {
              padding: 0 15px;
            }
          }

          @media (max-width: 480px) {
            .container {
              padding: 0 10px;
            }
          }

          /* Common utility classes */
          .text-center {
            text-align: center;
          }

          .text-left {
            text-align: left;
          }

          .text-right {
            text-align: right;
          }

          .mt-1 { margin-top: 0.25rem; }
          .mt-2 { margin-top: 0.5rem; }
          .mt-3 { margin-top: 0.75rem; }
          .mt-4 { margin-top: 1rem; }
          .mt-5 { margin-top: 1.25rem; }

          .mb-1 { margin-bottom: 0.25rem; }
          .mb-2 { margin-bottom: 0.5rem; }
          .mb-3 { margin-bottom: 0.75rem; }
          .mb-4 { margin-bottom: 1rem; }
          .mb-5 { margin-bottom: 1.25rem; }

          .p-1 { padding: 0.25rem; }
          .p-2 { padding: 0.5rem; }
          .p-3 { padding: 0.75rem; }
          .p-4 { padding: 1rem; }
          .p-5 { padding: 1.25rem; }

          .d-flex {
            display: flex;
          }

          .d-block {
            display: block;
          }

          .d-none {
            display: none;
          }

          .justify-center {
            justify-content: center;
          }

          .justify-between {
            justify-content: space-between;
          }

          .align-center {
            align-items: center;
          }

          .flex-column {
            flex-direction: column;
          }

          .flex-wrap {
            flex-wrap: wrap;
          }

          .w-100 {
            width: 100%;
          }

          .h-100 {
            height: 100%;
          }

          /* Button styles */
          .btn {
            display: inline-block;
            padding: 0.5rem 1rem;
            margin: 0.25rem;
            border: 1px solid transparent;
            border-radius: 0.25rem;
            text-decoration: none;
            text-align: center;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.2s ease-in-out;
          }

          .btn:hover {
            opacity: 0.9;
          }

          .btn-primary {
            background-color: #007bff;
            border-color: #007bff;
            color: #fff;
          }

          .btn-secondary {
            background-color: #6c757d;
            border-color: #6c757d;
            color: #fff;
          }

          .btn-success {
            background-color: #28a745;
            border-color: #28a745;
            color: #fff;
          }

          .btn-danger {
            background-color: #dc3545;
            border-color: #dc3545;
            color: #fff;
          }

          /* Form styles */
          .form-control {
            display: block;
            width: 100%;
            padding: 0.5rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            color: #495057;
            background-color: #fff;
            border: 1px solid #ced4da;
            border-radius: 0.25rem;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
          }

          .form-control:focus {
            color: #495057;
            background-color: #fff;
            border-color: #80bdff;
            outline: 0;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .form-label {
            display: inline-block;
            margin-bottom: 0.5rem;
            font-weight: 500;
          }

          /* Card styles */
          .card {
            background: #fff;
            border: 1px solid #dee2e6;
            border-radius: 0.25rem;
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
          }

          .card-header {
            padding: 0.75rem 1.25rem;
            margin-bottom: 0;
            background-color: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
          }

          .card-body {
            padding: 1.25rem;
          }

          .card-footer {
            padding: 0.75rem 1.25rem;
            background-color: #f8f9fa;
            border-top: 1px solid #dee2e6;
          }

          /* Alert styles */
          .alert {
            padding: 0.75rem 1.25rem;
            margin-bottom: 1rem;
            border: 1px solid transparent;
            border-radius: 0.25rem;
          }

          .alert-success {
            color: #155724;
            background-color: #d4edda;
            border-color: #c3e6cb;
          }

          .alert-danger {
            color: #721c24;
            background-color: #f8d7da;
            border-color: #f5c6cb;
          }

          .alert-warning {
            color: #856404;
            background-color: #fff3cd;
            border-color: #ffeaa7;
          }

          .alert-info {
            color: #0c5460;
            background-color: #d1ecf1;
            border-color: #bee5eb;
          }

          /* Loading animation */
          .loading-dots {
            display: inline-block;
          }

          .loading-dots:after {
            content: '...';
            animation: dots 1.5s steps(4, end) infinite;
          }

          @keyframes dots {
            0%, 20% {
              color: rgba(0, 0, 0, 0);
              text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
            }
            40% {
              color: black;
              text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
            }
            60% {
              text-shadow: 0.25em 0 0 black, 0.5em 0 0 rgba(0, 0, 0, 0);
            }
            80%, 100% {
              text-shadow: 0.25em 0 0 black, 0.5em 0 0 black;
            }
          }
        `}</style>
      </div>
    </I18nextProvider>
  );
}

export default App;