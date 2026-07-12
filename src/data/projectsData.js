export const projectsData = [
    {
        id: 'automated-report-creator',
        title: 'Automated Report Creator',
        shortDescription: 'AI-powered system using LLaMA 70B and Vector Databases to automate business report generation with serverless AWS infrastructure.',
        fullDescription: 'Built a scalable system using LLaMA 70B and Vector Databases to automate business report generation. The platform leverages cutting-edge AI models to parse, analyze, and synthesize data into professional reports, reducing manual effort and ensuring consistency across outputs.',
        tags: ['Python', 'LLaMA 70B', 'Vector DB', 'AWS S3', 'AWS Lambda'],
        features: [
            'AI-powered report generation using LLaMA 70B language model',
            'Vector Database integration for intelligent document retrieval',
            'Secure document storage with AWS S3',
            'Serverless report processing via AWS Lambda for cost efficiency',
            'Automated business intelligence report synthesis',
            'Scalable architecture for handling large document volumes'
        ],
        challenges: [
            'Designing reliable prompts for consistent, high-quality business report outputs',
            'Managing large document ingestion into Vector Databases efficiently',
            'Optimizing serverless function execution time and memory usage',
            'Ensuring secure handling of sensitive business data across AWS services'
        ],
        solutions: [
            'Developed a multi-stage prompt pipeline for structured report generation',
            'Implemented chunked document processing with optimized embedding strategies',
            'Used AWS Lambda layers and memory tuning for efficient serverless execution',
            'Configured S3 bucket policies and IAM roles for secure, compliant data handling'
        ],
        github: '',
        live: '',
        featured: true
    },
    {
        id: 'documint-erp',
        title: 'Documint ERP',
        shortDescription: 'Scalable, multi-tenant ERP built with Vite and Bun, featuring a database-level RBAC system using Supabase RLS and PLpgSQL.',
        fullDescription: 'Developed a scalable, multi-company Enterprise Resource Planning (ERP) application using Vite, TypeScript, and Bun for optimized runtime and fast build performance. Designed a multi-tenant architecture with dedicated company profiles, achieving seamless data isolation and scalable tenant provisioning.',
        tags: ['Vite', 'TypeScript', 'Bun', 'Supabase', 'PostgreSQL'],
        features: [
            'Multi-company Enterprise Resource Planning (ERP) architecture',
            'Optimized runtime and fast build performance using Bun',
            'Multi-tenant configuration with dedicated company profiles',
            'Database-level Role-Based Access Control (RBAC)',
            'Isolated Admin and Employee portals',
            'Seamless data isolation and scalable tenant provisioning'
        ],
        challenges: [
            'Ensuring strict data isolation between multiple tenants on a shared infrastructure',
            'Implementing secure and granular access control for different user roles (Admin vs. Employee)',
            'Optimizing build times and runtime performance for a complex, heavy enterprise application'
        ],
        solutions: [
            'Designed a multi-tenant architecture with dedicated company profiles for structural isolation',
            'Engineered database-level RBAC using Supabase Row Level Security (RLS) and custom PLpgSQL functions',
            'Leveraged Vite and Bun to minimize overhead and achieve faster execution and compilation'
        ],
        github: '',
        live: '',
        featured: true
    },
    {
        id: 'fuel-efficiency-prediction',
        title: 'Fuel Efficiency Prediction',
        shortDescription: 'Machine learning model using XGBoost achieving R² = 0.89 for vehicle MPG estimation, containerized with Docker for reproducible deployment.',
        fullDescription: 'Engineered an XGBoost machine learning model with an R² score of 0.89 to estimate vehicle fuel efficiency (MPG). The project focuses on feature engineering, model optimization, and containerized deployment using Docker for standardized and reproducible environments.',
        tags: ['Python', 'XGBoost', 'Scikit-Learn', 'Docker', 'Machine Learning'],
        features: [
            'XGBoost regression model with R² = 0.89 accuracy',
            'Comprehensive feature engineering pipeline',
            'Hyperparameter tuning for optimal model performance',
            'Docker containerization for reproducible deployment',
            'Data visualization and exploratory analysis',
            'Model evaluation with cross-validation metrics'
        ],
        challenges: [
            'Achieving high prediction accuracy with limited feature sets',
            'Handling missing values and outliers in automotive datasets',
            'Ensuring model deployment consistency across different environments',
            'Balancing model complexity with interpretability'
        ],
        solutions: [
            'Applied advanced feature engineering techniques to maximize signal extraction',
            'Implemented robust data preprocessing with outlier detection and imputation',
            'Used Docker to containerize the complete ML pipeline for reproducibility',
            'Employed SHAP analysis for model interpretability alongside XGBoost'
        ],
        github: '',
        live: '',
        featured: true
    }
];