const handleLogin = (e) => {
  e.preventDefault();
  if (email === "admin@company.com" && password === "password123") {
    localStorage.setItem("token", "dummy-auth-token");
    router.push("/dashboard"); // redirect to dashboard page
  } else {
    setError("Invalid email or password");
  }
};