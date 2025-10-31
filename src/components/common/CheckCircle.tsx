import { useEffect, useState } from 'react';

export default function CheckCircle() {
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCheck(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-20 h-20 relative flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-scale-in" />

      {showCheck && (
        <div className="absolute rotate-320 top-[27px] border-b-4 border-l-4 border-green-500 animate-draw-check" />
      )}
    </div>
  );
}
