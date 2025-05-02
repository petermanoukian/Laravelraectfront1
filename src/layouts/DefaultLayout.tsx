// DefaultLayout.tsx
import React from 'react';


const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <> 

    <div className="flex w-full flex-col items-center justify-center rounded-lg border border-gray-200 p-8">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 fill-current text-gray-500" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M0 3.75A.75.75 0 01.75 3h7.497c1.566 0 2.945.8 3.751 2.014A4.496 4.496 0 0115.75 3h7.5a.75.75 0 01.75.75v15.063a.75.75 0 01-.755.75l-7.682-.052a3 3 0 00-2.142.878l-.89.891a.75.75 0 01-1.061 0l-.902-.901a3 3 0 00-2.121-.879H.75a.75.75 0 01-.75-.75v-15zm11.247 3.747a3 3 0 00-3-2.997H1.5V18h6.947a4.5 4.5 0 012.803.98l-.003-11.483zm1.503 11.485V7.5a3 3 0 013-3h6.75v13.558l-6.927-.047a4.5 4.5 0 00-2.823.971z"></path></svg>
      </div>

      <div className="mt-8 text-center">
        <h1 className="text-4xl">Welcome to React 19 Demo with Laravel 12</h1>
        <p className="mx-auto mt-4 lg:w-1/2 text-gray-500">This is a demo of React 19.</p>
      </div>

      {children}
    </div>

  

    </>
  );
};

export default DefaultLayout;

