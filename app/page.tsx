// app/page.tsx
"use client"
import { useState, useEffect } from 'react';

const AnimatedBackground = () => {
  useEffect(() => {
    const canvas = document.getElementById('backgroundCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number }[] = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25
      });
    }

    const animate = () => {
      requestAnimationFrame(animate);
      ctx!.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx!.beginPath();
        ctx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx!.fill();
      });
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas id="backgroundCanvas" className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default function Home() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, text }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('Email sent successfully!');
        setTo('');
        setSubject('');
        setText('');
      } else {
        console.error('Server error:', data.error);
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Client error:', error);
      setStatus('An error occurred while sending the email.');
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen bg-apple-dark bg-opacity-90 flex flex-col justify-center items-center p-6 relative z-10">
        <div className="w-full max-w-md backdrop-blur-sm bg-apple-dark bg-opacity-50 p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-semibold text-center mb-8 text-apple-white">Send an Email</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Recipients (comma-separated)"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
                className="w-full bg-apple-gray text-apple-white placeholder-apple-light-gray border-0 rounded-lg p-3 focus:ring-2 focus:ring-apple-blue focus:outline-none transition-all duration-300"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full bg-apple-gray text-apple-white placeholder-apple-light-gray border-0 rounded-lg p-3 focus:ring-2 focus:ring-apple-blue focus:outline-none transition-all duration-300"
              />
            </div>
            <div>
              <textarea
                placeholder="Message"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                rows={6}
                className="w-full bg-apple-gray text-apple-white placeholder-apple-light-gray border-0 rounded-lg p-3 focus:ring-2 focus:ring-apple-blue focus:outline-none transition-all duration-300 resize-none"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-apple-blue text-apple-white font-semibold py-3 rounded-lg hover:bg-apple-blue-dark focus:outline-none focus:ring-2 focus:ring-apple-blue-light transition-all duration-300"
              >
                Send Email
              </button>
            </div>
          </form>
          {status && (
            <div className={`mt-4 text-center font-semibold ${status.includes('Error') ? 'text-apple-red' : 'text-apple-green'}`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </>
  );
}