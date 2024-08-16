# Camps for Champs

A camping service where you find place to relax, connect with nature, and yourself. You can find camps in different locations, save them, and check if space is available, and if you like it, you can book it.

![Presentation](./media/presentation.png)

[Demo](https://youtu.be/hWZk8-4SW0E)

## Features

- Drag a map to find camps in different locations
- Check availability of a camp as per guests and dates
- Save camps to your wishlist
- Pay for a camp booking
- Access and refresh tokens auth system
- Different rendering patterns (CSR, SSR, SSG, ISR)
- Responsive, fluid, [proper design system](https://www.figma.com/design/UVRba5oef3CqS1ifs5JPV9/camps-for-champs?node-id=10-2396&t=iK4PHZk7PpzvcuDD-1) and Storybook
- Type safe and runtime api response validation with Zod
- Testing with Cypress and Jest
- Admin dashboard for managing camps, users, orders, and reviews

## Getting Started

Start backend:

```bash
cd backend/
# Populate .env file
pipenv install
pipenv shell

cd src/
python manage.py makemigrations
python manage.py migrate
python manage.py runserver

# Optional to populate database
python manage.py seed_users --mode=refresh
python manage.py seed_tags --mode=refresh
python manage.py seed_features --mode=refresh
python manage.py seed_camps --mode=refresh
python manage.py seed_camp_images --mode=refresh
python manage.py seed_camp_features --mode=refresh
python manage.py seed_reviews --mode=refresh
```

Start frontend:

```bash
cd frontend/
# Populate .env file
pnpm install
pnpm run dev
```

## Technologies

Frontend:

- TypeScript, React, NextJS (pages router)
- MUI, Storybook, GSAP
- React Query, React Hook Form, Zustand, Zod
- Mapbox, Stripe
- Cypress, Jest, React Testing Library

Backend:

- Python, Django, Django Rest Framework
- SQLite
- Stripe, Cloudinary

## Next Steps

- Add more tests
- Add notification system
- Refactor FE and create common UI components
- Add animations

## Issues

- [Cypress Installation Issue](https://github.com/cypress-io/cypress/issues/2610)

## License

[MIT License](./LICENSE)
