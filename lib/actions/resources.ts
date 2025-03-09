'use server';

import {
    NewResourceParams,
    insertResourceSchema,
    resources,
} from '@/lib/db/schema/resources';
import { db } from '../db';

export const createResource = async (input: NewResourceParams) => {
    try {
        const { content } = insertResourceSchema.parse(input);

        const [resource] = await db
            .insert(resources)
            .values({ content })
            .returning();

        return 'Resource successfully created.';
    } catch (e) {
        if (e instanceof Error)
            return e.message.length > 0 ? e.message : 'Error, please try again.';
<<<<<<< HEAD
        else
            return 'An unknown error occurred.';
    }
};

=======
>>>>>>> 85ed686 (Merge main branch and resolve conflicts)
    }
};