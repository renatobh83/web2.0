import { useState } from "react";
import { useAuth } from "../context/AuthContext";
// import suportLogo from "../assets/support.svg"

interface Response {
	status: number;
}

export const Login = () => {
	const [loading, setLoading] = useState(false);
	const [isPwd, setIsPwd] = useState(true);
	const [form, setForm] = useState({ email: "", password: "" });
	const { login } = useAuth();

	const handleLogin = async (e: { preventDefault: () => void }) => {
		e.preventDefault();

		setLoading(true);
		login(form);
		setLoading(false);
	};

	return (
		<main className="flex items-center justify-center min-h-screen">
			<div className="relative w-full max-w-md p-8 bg-white border-t-4 border-blue-600 shadow-lg rounded-lg">
				<div className="text-center">
					{/* <img
              src={suportLogo}
              alt="Logo"
              className="mx-auto mb-6 h-32"
            /> */}
					<hr className="mb-6" />
				</div>
				<div className="text-center text-blue-600 mb-6">
					<h2 className="text-xl font-semibold">Bem vindo!</h2>
					<p className="text-sm text-gray-500">Faça seu login na aplicação</p>
				</div>
				<div className="space-y-4 text-zinc-600">
					<div className="relative">
						<input
							type="email"
							value={form.email}
							onChange={(e) => setForm({ ...form, email: e.target.value })}
							placeholder="meu@email.com"
							className={`w-full p-3 border rounded focus:outline-none
                  ${form.email ? "border-blue-500" : "border-gray-300"}
                `}
							onBlur={() => {} /* validação aqui */}
						/>
						<div className="absolute inset-y-0 left-0 flex items-center pl-3">
							{/* <i className="mdi mdi-email-outline text-blue-500"></i> */}
						</div>
					</div>
					<div className="relative">
						<input
							type={isPwd ? "password" : "text"}
							value={form.password}
							onChange={(e) => setForm({ ...form, password: e.target.value })}
							className="w-full p-3 border rounded focus:outline-none border-gray-300"
						/>
						<div className="absolute inset-y-0 left-0 flex items-center pl-3">
							{/* <i className="mdi mdi-shield-key-outline text-blue-500"></i> */}
						</div>
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<div
							className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
							onClick={() => setIsPwd(!isPwd)}
						>
							<i
								className={`mdi ${isPwd ? "mdi-eye-off-outline" : "mdi-eye-outline"}`}
							/>
						</div>
					</div>
				</div>
				<div className="mt-6 text-center">
					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
					<button
						onClick={handleLogin}
						disabled={loading}
						className="w-40 p-3 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
					>
						{loading ? (
							<span className="flex items-center justify-center">
								Logando...
							</span>
						) : (
							"Login"
						)}
					</button>
				</div>
				{loading && (
					<div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
						<div className="loader">Loading..</div>
					</div>
				)}
			</div>
		</main>
	);
};
