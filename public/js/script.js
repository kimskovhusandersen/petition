(function() {
    const profileMenuBtn = document.getElementById("profile-menu-btn");
    const profileMenu = document.getElementById("profile-menu");

    profileMenuBtn.addEventListener("click", e => {
        // e.preventDefault();
        profileMenu.classList.contains("on")
            ? profileMenu.classList.remove("on")
            : profileMenu.classList.add("on");
    });

    // document.addEventListener("click", () => {
    //     if (profileMenu.classList.contains("on")) {
    //         profileMenu.classList.remove("on");
    //     }
    // });
})();
