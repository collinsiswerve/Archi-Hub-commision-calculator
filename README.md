# Archi-Hub Studio Referral Commission Calculator

A browser-based calculator for estimating referral payouts in Kenyan shillings (KES). The estimate uses the amount Archi-Hub has received under the client’s contract, the type of work, the project duration and the referrer’s history.

[Open the live calculator](https://collinsiswerve.github.io/Archi-Hub-commision-calculator/)

## Using the calculator

1. Enter the amount the client has paid to Archi-Hub for the contract. The field adds thousands separators as you type and accepts pasted amounts such as `KES 1,250,000.50`.
2. Select the type of work covered by the contract.
3. Select the project duration from the date the initial deposit clears to project handover.
4. Select how many clients you have referred before.

The estimate updates as you enter the details. It shows the commission rate, the commission amount, the one-off finder’s fee and the combined total. **Clear details** resets the form.

## Payout calculation

The one-off **KES 5,000 finder’s fee** is paid when the referred client’s commitment fee clears. The percentage commission is calculated separately on the amount paid under the signed contract.

```text
Effective rate = (base rate × duration multiplier) + loyalty bonus
Commission = amount paid × effective rate
Total including finder’s fee = commission + KES 5,000
```

The calculator rounds the percentage commission to the nearest cent before adding the finder’s fee.

### Base rates

| Type of work | Base rate |
| --- | ---: |
| Design only | 3.00% |
| Project management | 2.00% |
| Repairs and renovations | 1.50% |
| Design and construction | 1.25% |
| Construction only | 1.00% |

### Duration multipliers

| Project duration | Multiplier |
| --- | ---: |
| Less than 1 month | × 1.00 |
| 1 through 3 months | × 0.80 |
| More than 3 months through 6 months | × 0.60 |
| More than 6 months | × 0.40 |

### Loyalty bonus

| Previous clients referred | Bonus |
| --- | ---: |
| First referral | 0.00 percentage points |
| 1–3 clients | 0.25 percentage points |
| 4 or more clients | 0.50 percentage points |

### Worked example

A client pays **KES 20,000,000** for a design-and-construction contract that lasts more than six months. The referrer has brought four clients before.

| Item | Result |
| --- | ---: |
| Effective rate (1.25% × 0.40 + 0.50 percentage points) | 1.00% |
| Referral commission | KES 200,000.00 |
| One-off finder’s fee | KES 5,000.00 |
| **Combined total** | **KES 205,000.00** |

## Running locally

The calculator uses HTML, CSS and vanilla JavaScript. To run it locally, use Python 3 to serve the repository and open it in a modern browser.

```sh
git clone https://github.com/collinsiswerve/Archi-Hub-commision-calculator.git
cd Archi-Hub-commision-calculator
python3 -m http.server --bind 127.0.0.1 8000
```

Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/).

## Project structure

| File | Purpose |
| --- | --- |
| [index.html](index.html) | Calculator form and the scope, duration and loyalty options |
| [styles.css](styles.css) | Responsive layout and Archi-Hub styling |
| [calculator.js](calculator.js) | Amount formatting, input validation, commission calculation and estimate display |
| [assets/archi-hub-studio.jpg](assets/archi-hub-studio.jpg) | Archi-Hub Studio logo |

The form stores rates as decimal fractions, so `0.0125` represents 1.25%. The calculation uses integer cents for currency amounts. Use the worked example above to check the payout after editing the form or calculation.

## Deployment

GitHub Pages publishes the calculator from `main`. Check the deployment status in [GitHub Actions](https://github.com/collinsiswerve/Archi-Hub-commision-calculator/actions).
