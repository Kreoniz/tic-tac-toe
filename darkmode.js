let darkMode = localStorage.getItem("darkMode");
const darkModeToggle = document.querySelector("#dark-mode-toggle");

const enableDarkMode = () => {
    document.body.classList.add("darkmode");
    darkModeToggle.classList.add("pressed");
    localStorage.setItem("darkMode", "enabled");
}

const disableDarkMode = () => {
    document.body.classList.remove("darkmode");
    darkModeToggle.classList.remove("pressed");
    localStorage.setItem("darkMode", null);
}

if (darkMode === "enabled") {
    enableDarkMode();
}

darkModeToggle.addEventListener("click", () => {
    darkMode = localStorage.getItem("darkMode");
    if (darkMode !== 'enabled') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});

document.addEventListener("keydown", (e) => {
    darkMode = localStorage.getItem("darkMode");
    if (e.key == "d") {
        if (darkMode !== 'enabled') {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }
});
