import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-b from-gradients-background-from to-gradients-background-to">
      <div className="max-w-md text-center">
        {/* 404 Number */}
        <h1 className="font-bold text-orange-500 text-9xl">404</h1>
        
        {/* Error Message */}
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">
          Halaman tidak ditemukan
        </h2>
        <p className="mb-8 text-gray-500">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
        </p>
        
        {/* Back Button */}
        <Button
          onClick={() => navigate({ to: "/dashboard" })}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Kembali ke Beranda
        </Button>
      </div>
      
      {/* Optional: Decorative Elements */}
      <div className="mt-16 text-gray-400">
        <div className="w-16 h-16 mx-auto">
          {/* You can add an illustration or icon here */}
          <svg
            className="w-full h-full"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 14h.01M12 16h.01M12 18h.01M12 20h.01M12 22h.01"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFound;