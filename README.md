# UniSphere: The All-in-One College Community Platform

<div align="center">

**A full-stack web application designed to be the central hub for college life, connecting students and clubs through events, real-time communities, and direct messaging.**

</div>

<br />

<div align="center">

<!-- You can add relevant badges here -->
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge"/>
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Badge"/>
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js Badge"/>
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL Badge"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS Badge"/>

</div>

<br />


## ✨ About The Project

UniSphere is a comprehensive platform built to enhance the college experience. It addresses the scattered nature of campus communication by providing a single, integrated solution where college clubs can announce and manage events, and students can discover opportunities, engage with peers, and build a vibrant community. From event registration to a real-time social feed, UniSphere is the digital heartbeat of the campus.


## 🚀 Key Features

*   **🎉 Event Management:** Clubs can create and manage events, specifying details like volunteer needs and participant capacity.
*   **✍️ User Registration:** Students can easily create a profile and register for events as either a participant or a volunteer.
*   **💬 Real-Time Community:** A dynamic, Twitter-like feed where users and clubs can post updates, share experiences, and interact through likes, comments, and shares. This feature is powered by **Ably** for live, instantaneous updates.
*   **📩 Direct Messaging:** A private chat feature for users to connect and communicate one-on-one.
*   **💳 Stripe Payment Integration:** Secure and seamless payment processing for ticketed events.
*   **☁️ Cloud Media Storage:** Efficiently handles image and media uploads using **Cloudinary**.
*   **🔐 Secure Authentication:** Utilizes `bcrypt` for password hashing to ensure user data is secure.


## 🛠️ Tech Stack

This project is built using a modern MERN-like stack, with PostgreSQL as the database.

| Category             | Technology                                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Frontend**         | `React`, `Redux`, `Vite`, `Axios`, `Tailwind CSS`                                                                  |
| **Backend**          | `Node.js`, `Express.js`                                                                                          |
| **Database**         | `PostgreSQL`                                                                                                     |
| **Authentication**   | `bcrypt`                                                                                                         |
| **Third-Party APIs** | `Ably` (Real-time), `Stripe` (Payments), `Cloudinary` (File Storage)                                               |


## 🏛️ Database Schema

The database is designed to efficiently manage the relationships between users, clubs, events, posts, and messages.

![image](https://github.com/user-attachments/assets/cd9d82f9-94be-4e03-ae75-98ff777754db)

## 📸 Application Screenshots
![image](https://github.com/user-attachments/assets/704c1461-5412-43b6-bc65-bd24b98bbc57)
![image](https://github.com/user-attachments/assets/6ee62e78-b8bd-4237-8e36-8ca6fdd2d814)
![image](https://github.com/user-attachments/assets/8352ccd4-d2fb-4391-85c4-0c0ec0317fc5)




**Event Feed & Details:**
![image](https://github.com/user-attachments/assets/9b6c21cb-1600-4e15-9a68-b43ad8db55ac)
![image](https://github.com/user-attachments/assets/8c15ae85-eae1-4087-b1e9-0433e48e7b32)


**Real-time Community Hub:**
![image](https://github.com/user-attachments/assets/5bc50549-dc27-42f5-8794-e2e0bbc1560b)


**Direct Messaging:**
![image](https://github.com/user-attachments/assets/443ed509-3990-489e-853a-6c62950e27f5)


## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing.

### Prerequisites

*   Node.js (v18 or newer recommended)
*   `npm` or `yarn`
*   A running instance of PostgreSQL

### Installation

1.  **Clone the Repository**
    ```
    git clone https://github.com/Akarsh1412/UniSphere.git
    cd UniSphere
    ```

2.  **Set Up Backend**
    ```
    cd backend
    npm install
    ```
    Create a `.env` file in the `/backend` directory and add the following variables:
    ```
    # Aiven PostgreSQL Database Configuration
    DB_USER=db_user
    DB_PASSWORD=db_password
    DB_HOST= db_host
    DB_PORT=dp_port
    DB_NAME=dp_name
    DB_CA_CERT=-----BEGIN CERTIFICATE-----
                xxxxxxxxxxxxxxxxxxxxxxxxx
                -----END CERTIFICATE-----

    # JWT Configuration
    JWT_SECRET=jwt_secret
    JWT_EXPIRE=nd

    # Bcrypt Configuration
    BCRYPT_ROUNDS=10

    # Server Configuration
    NODE_ENV=development
    PORT=5000

    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME=cloud_name
    CLOUDINARY_API_KEY=api_key
    CLOUDINARY_API_SECRET=api_secret

    # Admin User Configuration
    ADMIN_ID=admin_id
    ADMIN_PASSWORD=admin_password

    ABLY_API_KEY=ably_api_key

    # Frontend URL (for CORS and email links)
    FRONTEND_URL=http://localhost:5173

    # App Configuration
    APP_NAME=UniSphere

    STRIPE_SECRET_KEY=stripe_key
    ```

3.  **Set Up Frontend**
    ```
    cd ../frontend
    npm install
    ```
    Create a `.env` file in the `/frontend` directory and add the following variables:
    ```
    VITE_ABLY_API_KEY=api_key
    VITE_API_BASE_URL=your_backend_url
    VITE_STRIPE_PUBLISH_KEY=stripe_key
    ```

4.  **Set Up Admin**
   ```
   cd ../client
   npm install
   ```
   Create a `.env` file in the `/admin` directory and add the following variables:
   ```
    VITE_EMAILJS_SERVICE_ID=service_id
    VITE_EMAILJS_TEMPLATE_ID=template_id
    VITE_EMAILJS_PUBLIC_KEY=public_key

    VITE_API_URL=https://uni-sphere-backend-kappa.vercel.app
   ```

5.  **Run the Application**
    *   Start the backend server (from the `/backend` directory):
        ```
        npm run dev
        ```
    *   Start the frontend development server (from the `/frontend` directory):
        ```
        npm run dev
        ```
    *   Start the admin development server (from the `/admin` directory):
        ```
        npm run dev
        ```

The application should now be accessible at `http://localhost:5173`.
and the admin dashboard should now be accessible at `http://localhost:5174`.


## 🤝 Contributing

Contributions are what make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request


## 📄 License

Distributed under the MIT License. See `LICENSE.txt` for more information.


## 📧 Contact

Akarsh - [LinkedIn](https://www.linkedin.com/in/akarsh-1412-kumar/)

Project Link: [https://github.com/Akarsh1412/UniSphere](https://github.com/Akarsh1412/UniSphere)
Live Link: [UniSphere](https://uni-sphere-umber.vercel.app)
