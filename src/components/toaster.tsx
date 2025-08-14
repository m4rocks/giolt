import { Toaster as SonnerToaster } from "sonner";

export const Toaster = () => {
	return (
		<SonnerToaster
			toastOptions={{
				classNames: {
					toast: "!alert",
					success: "!alert-success",
					error: "!alert-error",
					warning: "!alert-warning",
					info: "!alert-info",
				},
			}}
		/>
	);
};
