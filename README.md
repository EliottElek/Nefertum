# Nefertum

Akinator like guesser for smells.

- Demo available at https://nefertum.tools.eurecom.fr/
- View feedbacks at https://nefertum.tools.eurecom.fr/feedbacks
- View community added sources at https://nefertum.tools.eurecom.fr/added-sources


## How to deploy for production

1. In the `client/` directory, copy the file `.env.example` into `.env.production` and edit it accordingly:

    * `NEXT_PUBLIC_API_ENDPOINT` - URL to the API endpoint
    * `NEXT_PUBLIC_SUPABASE_URL` - URL to the Supabase database
    * `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon

1. Run the following command:

    ```bash
    docker-compose -f docker-compose.yaml -f docker-compose.production.yaml up --build -d
    ```
