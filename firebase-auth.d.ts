declare function _exports({ apiKey }: {
    apiKey: any;
}): {
    signInWithEmailAndPassword: ({ email, password }: {
        email?: string;
        password?: string;
    }) => Promise<{
        idToken: string;
        refreshToken: string;
        expiresIn: number;
        uid: string;
    }>;

    signUpWithEmailAndPassword: ({ email, password }: {
        email?: string;
        password?: string;
    }) => Promise<{
        idToken: string;
        refreshToken: string;
        expiresIn: number;
        uid: string;
    }>;

    refreshIdToken: (refreshToken?: string) => Promise<{
        idToken: string;
        refreshToken: string;
    }>;
};
export = _exports;