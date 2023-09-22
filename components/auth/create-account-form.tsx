/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const formSchema = z.object({
	email: z
		.string({
			required_error: "Email is required."
		})
		.email({
			message: "Must be a valid email."
		}),
	password: z
		.string({
			required_error: "Password is required."
		})
		.min(8, {
			message: "Must be at least 8 characters."
		})
});

export function CreateAccountForm() {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const supabase = createClientComponentClient();
			const { email, password } = values;

			const {
				error,
				data: { user }
			} = await supabase.auth.signUp({
				email,
				password
			});

			// options: {
			// 	emailRedirectTo: `${location.origin}/auth/callback`;
			// }

			if (error) {
				console.log("CreateAccount: ", error);
			}

			if (user) {
				form.reset();
				// router.push("/");
				router.refresh();
			}
		} catch (error) {
			console.log("CreateAccountForm", error);
		}
	};

	return (
		<div className="flex flex-col justify-center items-center space-y-2">
			<span className="text-lg text-muted-foreground">You will love it.</span>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col space-y-2 w-full px-4 gap-4"
				>
					<FormField
						control={form.control}
						name="email"
						render={(field) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="Insert an email"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={(field) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="Insert an password"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Create Account</Button>
				</form>
			</Form>
		</div>
	);
}
