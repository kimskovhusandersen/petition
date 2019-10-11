(function() {
    const profileMenuBtn = document.getElementById("profile-menu-btn");
    const profileMenu = document.getElementById("profile-menu");
    const overlay = document.getElementById("overlay");

    const handleProfileMenu = () => {
        profileMenu.classList.contains("on")
            ? profileMenu.classList.remove("on")
            : profileMenu.classList.add("on");
        overlay.classList.contains("on")
            ? overlay.classList.remove("on")
            : overlay.classList.add("on");
    };

    if (profileMenuBtn) {
        profileMenuBtn.addEventListener("click", handleProfileMenu);
        overlay.addEventListener("click", handleProfileMenu);

        document.addEventListener("keyup", e => {
            if (e.code == "Escape" && profileMenu.classList.contains("on")) {
                handleProfileMenu();
            }
        });
    }
})();
