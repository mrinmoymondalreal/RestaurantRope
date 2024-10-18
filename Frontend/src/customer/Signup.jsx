import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";

export default function Signup() {
  let error = useSearchParams()[0].get("error");

  return (
    <div className="w-full flex box-border py-6 px-4 min-h-screen justify-center items-center bg-gray-300">
      <div className="max-w-screen-sm bg-white max-h-fit flex-1 h-full px-4 py-6 flex items-center justify-center flex-col gap-y-4 shadow-md rounded-md">
        <h1 className="text-xl font-bold uppercase">Signup</h1>
        <div className="text-red-600">{error}</div>
        <form
          method="POST"
          action={`${import.meta.env.VITE_NAME_URL}/auth/signup?redirect=${import.meta.env.VITE_NAME_URL}`}
          className="w-full max-w-sm relative space-y-4 flex flex-col items-center"
        >
          <Input type="text" placeholder="Name" name="name" required />
          <Input type="email" placeholder="Email" name="email" required />
          <Input
            type="mobile"
            placeholder="Mobile Number"
            name="phoneNumber"
            defaultValue="+91 "
            onInput={(e) => {
              if (e.target.value.slice(0, 4) == "+91 ") return;
              else e.target.value = "+91 " + e.target.value;
            }}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            name="password"
            required
          />
          <div>
            Already a user? <Link to="/login">Login Here</Link>
          </div>
          <Button type="submit" className="uppercase">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
