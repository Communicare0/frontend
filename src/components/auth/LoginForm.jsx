import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FormError from "@/components/ui/FormError";

export default function LoginForm() {
    return (
        <form>
            <Input name="email" placeholder="Email" />
            <Input name="password" type="password" placeholder="Password" />
            <FormError message="" />
            <Button type="submit">Login</Button>
        </form>
    )
}