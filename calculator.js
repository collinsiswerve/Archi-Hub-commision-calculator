"use strict";

const form = document.getElementById("projectDetails");
const paymentInput = document.getElementById("projectSum");
const scope = document.getElementById("scope");
const duration = document.getElementById("duration");
const referrals = document.getElementById("referrals");
const amountError = document.getElementById("amountError");
const commissionOutput = document.getElementById("totalPayout");
const rateOutput = document.getElementById("finalRate");
const estimateHint = document.getElementById("estimateHint");
const combinedOutput = document.getElementById("combinedPayout");
const announcement = document.getElementById("estimateAnnouncement");

const finderFeeCents = 500_000n;
const shillingFormatter = new Intl.NumberFormat("en-KE");
const rateFormatter = new Intl.NumberFormat("en-KE", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
const currencyPrefix = /^\s*(?:KES|KSHS?)\.?\s*/i;
const editableAmount = /^\d*(?:\.\d{0,2})?$/;
const pastedAmount = /^(?:\d*|\d{1,3}(?:,\d{3})+|\d{1,3}(?:[ \u00a0\u202f]\d{3})+)(?:\.\d{0,2})?$/;

function withoutGrouping(text) {
    return text.replace(currencyPrefix, "").replace(/[,\s]/g, "");
}

function asCents(amount) {
    const [shillings, fraction = ""] = amount.split(".");
    return BigInt(shillings + fraction.padEnd(2, "0"));
}

function formatMoney(cents) {
    const shillings = shillingFormatter.format(cents / 100n);
    const fraction = (cents % 100n).toString().padStart(2, "0");
    return "KES " + shillings + "." + fraction;
}

function showAmountError(message) {
    amountError.textContent = message;
    amountError.hidden = message === "";
    if (message) {
        paymentInput.setAttribute("aria-invalid", "true");
    } else {
        paymentInput.removeAttribute("aria-invalid");
    }
}

function groupPaymentInput(event) {
    const raw = paymentInput.value;
    const amount = withoutGrouping(raw);
    if (!editableAmount.test(amount)) return;

    const [whole, fraction] = amount.split(".");
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const formatted = fraction === undefined ? grouped : grouped + "." + fraction;
    if (formatted === raw) return;

    const charactersBeforeCaret = withoutGrouping(raw.slice(0, paymentInput.selectionStart)).length;
    let caret = 0;
    let charactersSeen = 0;
    while (caret < formatted.length && charactersSeen < charactersBeforeCaret) {
        if (formatted[caret] !== ",") charactersSeen++;
        caret++;
    }
    if (event.inputType === "deleteContentForward" && formatted[caret] === ",") caret++;

    paymentInput.value = formatted;
    paymentInput.setSelectionRange(caret, caret);
}

function renderEstimate() {
    const amount = withoutGrouping(paymentInput.value);
    const validAmount = editableAmount.test(amount);
    const enteredAmount = amount !== "" && amount !== ".";
    const paidCents = validAmount && enteredAmount ? asCents(amount) : 0n;
    const invalid = !validAmount || (enteredAmount && paidCents === 0n);
    showAmountError(invalid ? "Enter a positive amount with up to two decimal places." : "");

    const complete = paidCents > 0n && scope.value !== "" && duration.value !== "";
    const rate = Number(scope.value) * Number(duration.value) + Number(referrals.value);
    const basisPoints = BigInt(Math.round(rate * 10_000));

    // Round the percentage commission to the nearest cent before adding the finder’s fee.
    const commissionCents = (paidCents * basisPoints + 5_000n) / 10_000n;
    commissionOutput.textContent = complete ? formatMoney(commissionCents) : "—";
    combinedOutput.textContent = complete ? formatMoney(commissionCents + finderFeeCents) : "—";
    rateOutput.textContent = complete ? "Rate applied " + rateFormatter.format(rate) : "";
    rateOutput.hidden = !complete;
    estimateHint.hidden = complete;
    announcement.textContent = complete ? "Estimated commission " + commissionOutput.textContent + "." : "";
}

paymentInput.addEventListener("input", (event) => {
    groupPaymentInput(event);
    renderEstimate();
});

paymentInput.addEventListener("paste", (event) => {
    const text = event.clipboardData.getData("text").trim().replace(currencyPrefix, "");
    if (pastedAmount.test(text)) return;

    event.preventDefault();
    showAmountError("Use a number like 1,250,000.50 with a full stop for cents.");
});

for (const select of [scope, duration, referrals]) {
    select.addEventListener("change", renderEstimate);
}

form.addEventListener("submit", (event) => event.preventDefault());
document.getElementById("clearDetails").addEventListener("click", () => {
    form.reset();
    renderEstimate();
    paymentInput.focus();
});

document.getElementById("finderFee").textContent = formatMoney(finderFeeCents);
renderEstimate();
