import { useNavigate } from '@tanstack/react-router';
import { Button } from "@/components/ui/button"


export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication state (e.g., remove token from storage)
    // setIsLoggedIn(false); // Update your isLoggedIn state

    // Redirect to login page
    navigate({ to: "/" }); 
  };

  return (
    <div className='flex flex-col items-center justify-center '>
      <div className="h-1 text-center">HOME PAGE</div>
      <Button className='mt-5 bg-blue-400 w-fit' onClick={handleLogout}>Logout</Button>
    </div>
  );
}