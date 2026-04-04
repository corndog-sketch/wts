# Wagga Technology Solutions — Website

Static website for [Wagga Technology Solutions](https://waggatechsolutions.com.au), a local IT support and web design business based in Wagga Wagga NSW, operated by Alex Corneliusen.

## Tech Stack

Pure HTML/CSS/JS — no build tools, no frameworks, no npm. Every page is a standalone `.html` file that links to a shared stylesheet (`css/styles.css`).

## File Structure

```
/
├── index.html                                   # Homepage
├── about-us.html                                # About Alex
├── contact-us.html                              # Contact & enquiry form
├── web-design.html                              # Web design services
├── web-maintenance.html                         # WordPress care plans
├── small-business-it-support.html              # Business IT support
├── home-support.html                            # Home tech support
├── tech-support-for-seniors.html               # Seniors tech help
├── microsoft-365-setup-in-wagga-wagga.html     # Microsoft 365
├── office-it-fitout-in-wagga-wagga.html        # Office IT fitout
├── business-automation.html                     # Business automation
├── ai-that-works-for-your-business.html        # AI implementation
├── device-setup.html                            # Device setup
├── professional-networking-solutions.html       # Networking
├── wifi-help-wagga-wagga.html                  # WiFi help
├── virus-malware-removal-in-wagga-wagga.html   # Virus removal
├── computer-service.html                        # Computer repairs
├── printer-setup-wagga-wagga.html              # Printer setup
├── terms-and-conditions.html                    # T&Cs
├── blog.html                                    # Blog
├── css/
│   └── styles.css                               # Shared stylesheet
├── shared/
│   └── nav.html                                 # Nav reference snippet
├── CNAME                                        # Custom domain for GitHub Pages
└── README.md
```

## Deploying to GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Choose **main** branch and **/ (root)** folder
5. Click **Save**

GitHub Pages will build and deploy the site. It will be live at `https://corndog-sketch.github.io/wts/` within a few minutes.

## Pointing Your Custom Domain

To use `waggatechsolutions.com.au`:

### Option A — CNAME record (recommended for subdomains)
Add a CNAME record in your DNS:
```
Type:  CNAME
Name:  www
Value: corndog-sketch.github.io
```

### Option B — A records (for apex/root domain)
Add these four A records in your DNS:
```
Type:  A
Name:  @
Value: 185.199.108.153

Type:  A
Name:  @
Value: 185.199.109.153

Type:  A
Name:  @
Value: 185.199.110.153

Type:  A
Name:  @
Value: 185.199.111.153
```

The `CNAME` file in the repo root tells GitHub Pages to serve the site at `waggatechsolutions.com.au`. DNS changes can take up to 48 hours to propagate.

Once DNS is set up, go to **Settings → Pages** and enter `waggatechsolutions.com.au` in the **Custom domain** field, then enable **Enforce HTTPS**.

## Updating Content

Each page is a self-contained HTML file. To update content:

1. Find the relevant `.html` file (e.g. `contact-us.html`)
2. Edit the text directly — look for content between the `<section>` tags
3. Save and commit the changes

You can do this directly on GitHub (click the file → pencil icon → edit → commit) or clone the repo locally and edit with any text editor.

## Contact

Alex Corneliusen — alex@waggatechsolutions.au — 0473 430 419
