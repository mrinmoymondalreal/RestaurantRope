import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";

export default function Login() {
  let error = useSearchParams()[0].get("error");

  return (
    <div className="w-full flex box-border py-6 px-4 min-h-screen justify-center items-center bg-gray-300">
      <div className="max-w-screen-sm bg-white max-h-fit flex-1 h-full px-4 py-6 flex items-center justify-center flex-col gap-y-4 shadow-md rounded-md">
        <h1 className="text-xl font-bold uppercase">Login Using Email</h1>
        <div className="text-red-600">{error}</div>
        <form
          method="POST"
          action="http://192.168.0.103:3000/auth/login?redirect=http://192.168.0.103:5173/"
          className="w-full max-w-sm relative space-y-4 flex flex-col items-center"
        >
          <Input type="email" placeholder="Email" name="email" required />
          <Input
            type="password"
            placeholder="Password"
            name="password"
            required
          />
          <div>
            New? <Link to="/signup">Signup Here</Link>
          </div>
          <Button type="submit" className="uppercase">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
