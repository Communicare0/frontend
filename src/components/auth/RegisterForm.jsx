import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";

export default function RegisterForm() {
  return (
    <form>
      <Input name="email" placeholder="Email" />
      <Input name="password" type="password" placeholder="Password" />
      <Input name="passwordConfirm" type="password" placeholder="Confirm Password" />
      <FormError message="" />
      <Button type="submit">Create Account</Button>
    </form>
  );
}