# ZOLOFRESH — Premium Organic Farm Treasures & Bihari Specialties

ZOLOFRESH is a state-of-the-art e-commerce storefront showcasing the agricultural bounty, rich cultural heritage, sacred festival essentials, and generational delicacies of Bihar, India.

Built with a premium earth-toned rustic design system, responsive glassmorphism navigation, and advanced micro-interactions, ZOLOFRESH connects local farmer cooperatives directly to families across India.

---

## 🌾 Feature Highlights

*   **Custom Vector Branding**: Modern styled SVG branding incorporating the signature emerald sprout leaf and warm gold crest.
*   **Aesthetic User Interface**: Elegant typography (Outfit & Cinzel), glassmorphism frosted nav header, responsive layout, dynamic hero section animations, and sliding card hover interactions.
*   **Normalized Database Simulation**: Simulates a production-ready relational database in `localStorage` containing 9 interconnected collections.
*   **Command Control Panel**: Administrative dashboard featuring statistics cards (Gross Revenue, Orders, Average Order, Low Stock alerts), bulk inventory CSV exporter, SKU auto-suggest engine, and full CRUD modal operations.
*   **Continuous Integration & Deployment (CI/CD)**: Fully automated deployment pipeline deploying static assets to your custom domain via GitHub Actions on every git push.

---

## 🗂️ Nested Category Taxonomy

To support agricultural scalability, the catalog is structured using a hierarchical parent-child category tree:

```
├── Fruits & Fresh Produce
│   ├── Shahi Litchi
│   └── Jardalu Mango
├── Staples & Grains
│   ├── Katarni Rice
│   ├── Bhagalpuri Rice
│   ├── Chana Ka Sattu
│   └── Chura / Poha
├── Superfoods & Snacks
│   ├── Mithila Makhana
│   ├── Bhuna Makhana
│   ├── Silao Khaja
│   ├── Tilkut
│   ├── Thekua
│   ├── Jaggery
│   └── Traditional Sweets
├── Handlooms & Handicrafts
│   ├── Madhubani Paintings
│   ├── Bhagalpuri Silk
│   └── Sikki Grass Craft
└── Puja Essentials & Kits
    ├── Diwali Puja Kit
    ├── Durga Puja Kit
    └── Satyanarayan Puja Kit
```

---

## 💾 Relational Database Structure

The database consists of 9 fully normalized tables defined in [schema_migration.sql](schema_migration.sql):

1.  **`categories`**: Stores parent categories and subcategories linked via `parent_id` self-referential keys.
2.  **`products`**: Product details mapped to their respective leaf subcategory IDs.
3.  **`product_images`**: Manages sorting order and URLs of product assets.
4.  **`product_inventory`**: Real-time stock quantities, safety minimums, and warehouses.
5.  **`product_attributes`**: Stores key specifications (Organic, GI Tagged, Seasonal).
6.  **`product_variants`**: Weight options (e.g. 500g, 1kg) and custom pricing.
7.  **`product_tags`**: Facilitates tag searches (e.g. `Organic`, `GI Tagged`).
8.  **`seasonal_availability`**: Maps harvest months and preorder rules.
9.  **`product_seo`**: Custom meta titles and canonical links.

---

## 🚀 Deployment & Custom Domain

The site is automatically deployed via GitHub Actions.

*   **Live Custom Domain**: [https://zolofresh.in](https://zolofresh.in)
*   **GitHub Pages Endpoint**: [https://nikhilkumar-sinha.github.io/zolo/](https://nikhilkumar-sinha.github.io/zolo/)
*   **CI/CD Pipeline**: Configured in [.github/workflows/static.yml](.github/workflows/static.yml) for automated builds on push.

### DNS Records Configuration (GoDaddy)
To point the domain to GitHub, configure these records in your GoDaddy DNS settings:
*   **A Records** (Name: `@`):
    *   `185.199.108.153`
    *   `185.199.109.153`
    *   `185.199.110.153`
    *   `185.199.111.153`
*   **CNAME Record** (Name: `www`): Point to `nikhilkumar-sinha.github.io`

---

## 📊 Spreadsheet Catalog Management (Excel)

ZoloFresh uses a standard Microsoft Excel spreadsheet ([`catalog.xlsx`](file:///d:/organic_online_website/catalog.xlsx)) as the primary administrative source of truth for all products and categories. 

### Spreadsheet Schema (`catalog.xlsx` - "Products" sheet):
*   **`category`**: Parent category segment (`Fruits`, `Grains`, `Makhana`, `Puja`, `Sweets`, `Crafts`).
*   **`Product Name`**: Full display name of the item.
*   **`Sub-Categorie`**: Tag specifying classification (`GI Tagged`, `Organic`, `Traditional`).
*   **`SKU`**: Unique stock keeping unit.
*   **`Discount`**: Numerical discount percentage (e.g. `5` for 5%).
*   **`Price`**: Final discounted unit price.
*   **`Sales Price`**: Original base unit price.
*   **`Unit`**: Package measurement (e.g., `Pack of 500g`, `Handmade Canvas (A4 Size)`).
*   **`Stock Quantity`**: Available inventory count (e.g., `50 Units`, `100 Grams`).
*   **`Product Image`**: Relative path to local assets (e.g., `.\assets\shahi_litchi.jpg`).

### Synchronization Scripts
A custom Python script [`sync_catalog.py`](file:///d:/organic_online_website/sync_catalog.py) translates changes between the Excel spreadsheet, SQLite database, and the static website files.

1.  **Install Spreadsheet Dependencies**:
    ```bash
    python -m pip install openpyxl
    ```
2.  **Import & Sync (Apply Excel Changes to Website)**:
    Modify details directly in `catalog.xlsx`, save it, then run:
    ```bash
    python sync_catalog.py
    ```
    *This updates the local SQLite database (`zolofresh.db`) and exports the static JSON models to [`catalog-data.js`](file:///d:/organic_online_website/catalog-data.js) to instantly update the website storefront.*
3.  **Export (Re-generate Excel from Database)**:
    If products are added via the database control panel, export them back into the spreadsheet with:
    ```bash
    python sync_catalog.py --export
    ```

---

## 🛠️ Local Development & Quick Start

1.  Clone the repository:
    ```bash
    git clone https://github.com/nikhilkumar-sinha/zolo.git
    ```
2.  Install requirements:
    ```bash
    python -m pip install openpyxl
    ```
3.  Launch the local server:
    ```bash
    python server.py
    ```
4.  Open `http://localhost:8000` in your web browser.

---

## 🔑 Administrative Access

To access the Store Manager Control Center:
*   **Endpoint**: `http://localhost:8000/admin.html`
*   **Default Username**: `admin`
*   **Default Password**: `khetihaar2026`
