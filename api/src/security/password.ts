import bcryptjs from 'bcryptjs';

export const hash = async (plainTextPassword: string): Promise<string> => {
    const salt = await bcryptjs.genSalt(5);
    const hash = await bcryptjs.hash(plainTextPassword, salt);
    return hash

};

export const compare = async (plainTextPassword: string, hashedPassword: string): Promise<boolean> => {
    const isOk = await bcryptjs.compare(plainTextPassword, hashedPassword);
    return isOk;
}
