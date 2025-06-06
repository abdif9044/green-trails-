
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const CtaSection = () => {
  const { user } = useAuth();
  
  // Don't render if user is logged in
  if (user) {
    return null;
  }
  
  return (
    <section className="py-16 bg-greentrail-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-greentrail-100 text-lg mb-8">
            Join GreenTrails today and discover a community of outdoor enthusiasts who share your passion.
          </p>
          <Link to="/auth?signup=true">
            <Button className="bg-white text-greentrail-700 hover:bg-greentrail-100 px-8 py-6 text-lg rounded-full">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
