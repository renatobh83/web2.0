import { create } from "zustand";

interface User {
	isAdmin: boolean;
	token: string | null;
	isSuporte: boolean;
	setIsAdmin: (data: { profile: string }) => void;
	setIsSuport: (data: any) => void;
}

export const useUserStore = create<User>((set) => ({
	isAdmin: false,
	token: null,
	isSuporte: false,

	setIsAdmin: (data) =>
		set((state) => ({
			isAdmin: !!(state.isSuporte || data.profile === "admin"),
		})),

	setIsSuport: (data) => {
		const domains = ["@"]; // Exemplo: Verifica se o email contém '@'
		let authorized = false;
		// biome-ignore lint/complexity/noForEach: <explanation>
		domains.forEach((domain) => {
			if (
				data?.email.toLocaleLowerCase().indexOf(domain.toLocaleLowerCase()) !==
				-1
			) {
				authorized = true;
			}
		});
		set({ isSuporte: authorized }); // Atualiza o estado de isSuporte
	},
}));
