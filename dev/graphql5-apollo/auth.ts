import jwt from "jsonwebtoken";

export const VerifyToken = ({ token }: { token: string }) => (
    jwt.verify(token, process.env.JWT_SECRET as string)
);

export const GenerateToken = ({ id, email }: { id: number, email: string }) => {
    try {
        return jwt.sign({ id, email }, process.env.JWT_SECRET as string, {
            expiresIn: "1h"
        });
    } catch (err) {
        console.error(err);
        return null;
    }
};