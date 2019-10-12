(function() {
    const profileMenu = document.getElementById("profile-menu");
    const listProfileMenu = document.getElementById("list-profile-menu");
    const overlay = document.getElementById("overlay");

    const handleProfileMenu = () => {
        listProfileMenu.classList.contains("on")
            ? listProfileMenu.classList.remove("on")
            : listProfileMenu.classList.add("on");
        overlay.classList.contains("on")
            ? overlay.classList.remove("on")
            : overlay.classList.add("on");
    };

    if (profileMenu) {
        profileMenu.addEventListener("click", handleProfileMenu);
        overlay.addEventListener("click", handleProfileMenu);

        document.addEventListener("keyup", e => {
            if (
                e.code == "Escape" &&
                listProfileMenu.classList.contains("on")
            ) {
                handleProfileMenu();
            }
        });
    }
})();
