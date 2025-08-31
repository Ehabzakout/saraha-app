import { useEffect } from "react";

export default function LoginWithGoogle() {
	const client_id =
		"594465096502-j64msv9nqdhskf45lj85m140uglboad4.apps.googleusercontent.com";
	useEffect(() => {
		const loadGoogleScript = () => {
			const script = document.createElement("script");
			script.src = "https://accounts.google.com/gsi/client";
			script.async = true;
			script.defer = true;
			script.onload = () => initializeGoogleLogin();
			document.body.appendChild(script);
		};

		const initializeGoogleLogin = () => {
			if (window.google) {
				window.google!.accounts.id.initialize({
					client_id, // Replace with your client ID
					callback: handleCredentialResponse,
				});

				window.google.accounts.id.renderButton(
					document.getElementById("google-login-button"),
					{
						theme: "filled_blue",
						size: "large",
						text: "signin",
						shape: "pill",
						logo_alignment: "left",
						width: 300,
					}
				);

				// Optional: Auto login
				// window.google.accounts.id.prompt();
			}
		};

		loadGoogleScript();
	}, []);

	const handleCredentialResponse = async (response) => {
		const res = await fetch("http://localhost:3000/auth/with-google", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ tokenId: response.credential }),
		});
		const payload = await res.json();
		console.log(payload);
		// Send this token to backend to verify & authenticate the user
	};

	return <div id="google-login-button" style={{ margin: "20px" }}></div>;
}
