document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const sidebarClose = document.getElementById("sidebarClose");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const navLinks = document.querySelectorAll(".nav-link");

    function openSidebar() {
        if (sidebar) {
            sidebar.classList.add("active");
        }

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("active");
        }

        document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
        if (sidebar) {
            sidebar.classList.remove("active");
        }

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }

        document.body.style.overflow = "";
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", openSidebar);
    }

    if (sidebarClose) {
        sidebarClose.addEventListener("click", closeSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", closeSidebar);
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });

    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            if (window.innerWidth <= 1024) {
                closeSidebar();
            }
        });
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 1024) {
            closeSidebar();
        }
    });

    const notificationToggle = document.getElementById("notificationToggle");
    const notificationDropdown = document.getElementById("notificationDropdown");

    function closeNotifications() {
        if (notificationDropdown) {
            notificationDropdown.classList.remove("open");
        }
    }

    if (notificationToggle && notificationDropdown) {
        notificationToggle.addEventListener("click", function (event) {
            event.stopPropagation();
            notificationDropdown.classList.toggle("open");
        });

        notificationDropdown.addEventListener("click", function (event) {
            event.stopPropagation();
        });

        document.addEventListener("click", closeNotifications);

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeNotifications();
            }
        });
    }
});