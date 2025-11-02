// ---------- NAVBAR SCROLL EFFECT ----------
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
    highlightActiveLink();
});

// ---------- NAVBAR CLICK & SMOOTH SCROLL ----------
const navLinks = document.querySelectorAll(".navbar-nav a");
navLinks.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;

        const offset = document.querySelector(".navbar").getBoundingClientRect().height;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = target.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset + 40;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });

        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
    });
});

// ---------- HIGHLIGHT NAVBAR LINKS BASED ON SCROLL ----------
const sections = document.querySelectorAll("section, .frontpage");
function highlightActiveLink() {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    sections.forEach(section => {
        if (
            section.offsetTop <= scrollPos &&
            section.offsetTop + section.offsetHeight > scrollPos
        ) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (
                    link.getAttribute("href") &&
                    link.getAttribute("href").substring(1) === section.id
                ) {
                    link.classList.add("active");
                }
            });
        }
    });
}

// ---------- FLASH MESSAGE HANDLER ----------
function showFlash(message, type = "success", container = document.body) {
    const flash = document.createElement("div");
    flash.className = `flash ${type}`;
    flash.textContent = message;
    flash.style.opacity = "0";
    flash.style.transform = "translateY(-10px)";
    flash.style.transition = "opacity 0.4s ease, transform 0.4s ease";

    // ✅ Insert the flash message OUTSIDE the form, directly above it
    container.insertAdjacentElement("beforebegin", flash);

    // Animate it in
    requestAnimationFrame(() => {
        flash.style.opacity = "1";
        flash.style.transform = "translateY(0)";
    });

    // Auto fade out
    setTimeout(() => {
        flash.style.opacity = "0";
        flash.style.transform = "translateY(-20px)";
        setTimeout(() => flash.remove(), 800);
    }, 3500);
}


// ---------- CONTACT FORM AJAX SUBMIT ----------
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".compose-panel form");

    if (form) {
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(form);

            // Change button text to "Sending..."
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Sending...";
            }

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                });

                const result = await response.json();

                if (response.ok && result.status === "success") {
                    showFlash("✅ Your message was sent successfully!", "success", form);
                    form.reset();
                } else {
                    showFlash("⚠️ Failed to send message.", "danger", form);
                }
            } catch (error) {
                console.error("Send failed:", error);
                showFlash("⚠️ Error sending message.", "danger", form);
            } finally {
                // Revert button text
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Send Message";
                }
            }
        });
    }
});
