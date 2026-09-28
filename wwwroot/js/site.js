document.addEventListener("DOMContentLoaded", () => {
    let sizeA = 0;
    let sizeB = 0;

    const deltaSpan = document.getElementById("delta-span");
    const gridNodes = document.querySelectorAll(".memory-block-node");

    const slotA = {
        name: document.getElementById("slot-a-name"),
        meta: document.getElementById("slot-a-meta"),
        img: document.getElementById("slot-a-img"),
        fallback: document.getElementById("slot-a-fallback")
    };

    const slotB = {
        name: document.getElementById("slot-b-name"),
        meta: document.getElementById("slot-b-meta"),
        img: document.getElementById("slot-b-img"),
        fallback: document.getElementById("slot-b-fallback")
    };

    document.addEventListener("click", (e) => {
        const btnA = e.target.closest(".select-cart-a");
        const btnB = e.target.closest(".select-cart-b");
        
        if (!btnA && !btnB) return;

        const row = e.target.closest("[data-size]");
        if (!row) return;

        const size = parseInt(row.getAttribute("data-size")) || 0;
        const name = row.getAttribute("data-name") || "";
        const chip = row.getAttribute("data-chip") || "";
        const date = row.getAttribute("data-date") || "";
        const imgSrc = row.querySelector("img") ? row.querySelector("img").getAttribute("src") : "";

        if (btnA) {
            sizeA = size;
            updateSlot(slotA, name, size, chip, date, imgSrc);
        } else if (btnB) {
            sizeB = size;
            updateSlot(slotB, name, size, chip, date, imgSrc);
        }

        updateMemoryAllocationMatrix();
    });

    function updateSlot(slot, name, size, chip, date, imgSrc) {
        if (!slot.name || !slot.meta) return;
        slot.name.textContent = name;
        slot.meta.textContent = `${size} KB | ${chip} | ${date}`;
        if (imgSrc && slot.img && slot.fallback) {
            slot.img.setAttribute("src", imgSrc);
            slot.img.classList.remove("hidden");
            slot.fallback.classList.add("hidden");
        } else if (slot.img && slot.fallback) {
            slot.img.classList.add("hidden");
            slot.fallback.classList.remove("hidden");
        }
    }

    const resetBtn = document.getElementById("reset-sorting");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            sizeA = 0;
            sizeB = 0;
            if (slotA.name) slotA.name.textContent = "Select Component...";
            if (slotA.meta) slotA.meta.textContent = "00 KB | NROM | NONE";
            if (slotA.img) slotA.img.classList.add("hidden");
            if (slotA.fallback) slotA.fallback.classList.remove("hidden");
            
            if (slotB.name) slotB.name.textContent = "Select Component...";
            if (slotB.meta) slotB.meta.textContent = "00 KB | NROM | NONE";
            if (slotB.img) slotB.img.classList.add("hidden");
            if (slotB.fallback) slotB.fallback.classList.remove("hidden");
            
            updateMemoryAllocationMatrix();
        });
    }

    function updateMemoryAllocationMatrix() {
        const delta = Math.abs(sizeA - sizeB);
        if (deltaSpan) {
            deltaSpan.textContent = `${delta} KB`;
        }

        gridNodes.forEach((node, idx) => {
            const currentKb = idx + 1;
            node.className = "aspect-square rounded-[2px] border border-[#1f2937]/30 transition-all duration-150 memory-block-node";

            if (currentKb <= sizeA && currentKb <= sizeB) {
                node.classList.add("bg-[#ef4444]", "shadow-[0_0_4px_#df3337]");
            } else if (currentKb <= sizeA) {
                node.classList.add("bg-[#df3337]");
            } else if (currentKb <= sizeB) {
                node.classList.add("bg-[#00e5ff]", "shadow-[0_0_4px_#00b2c7]");
            } else {
                node.classList.add("bg-[#111823]");
            }
        });
    }
});
