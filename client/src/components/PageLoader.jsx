import { Snowflake } from 'lucide-react';
import React from 'react';

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Snowflake className="animate-spin w-6 h-6 text-blue-500 [animation-duration:1.5s]" />
    </div>
  );
};

export default PageLoader;
