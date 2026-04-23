
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                emailRedirectTo: window.location.origin,
            },
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Error signing up",
                description: error.message,
            });
        } else {
            // Check if email confirmation is required
            if (data?.user?.identities?.length === 0) {
                toast({
                    variant: "destructive",
                    title: "Email already registered",
                    description: "This email is already in use. Please log in instead.",
                });
            } else if (data?.user && !data?.session) {
                toast({
                    title: "Account created!",
                    description: "Please check your email to verify your account before logging in.",
                });
                navigate("/auth/login");
            } else {
                // Email confirmation is disabled, user is logged in immediately
                toast({
                    title: "Account created!",
                    description: "You have been logged in automatically.",
                });
                navigate("/");
            }
        }
        setLoading(false);
    };

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                        <CardDescription>
                            Enter your email below to create your account
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSignup}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign up"}
                            </Button>
                            <div className="text-sm text-center text-muted-foreground">
                                Already have an account?{" "}
                                <Link to="/auth/login" className="text-primary hover:underline">
                                    Log in
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default Signup;
