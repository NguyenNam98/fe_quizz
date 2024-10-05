import { Box, Typography } from '@mui/material';
import crypto from 'crypto';
import axios from "axios";

interface FilePageProps {
    params: {
        id: string;
    };
}

export default async function FilePage({ params }: FilePageProps) {
    const { id } = params;

    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST_API}/api/block-chain/v1/file?fileId=${id}`, {
            responseType: 'arraybuffer',
            headers: {
                "au-payload": JSON.stringify({ userId: "da55d49f-44bb-4cb3-b3d8-799d04564bf9" })
            }
        });

        // Convert ArrayBuffer to Buffer (Node.js)
        const fileBuffer = Buffer.from(response.data);  // Convert arraybuffer to buffer

        const contentType = response.headers.get('content-type');
        const signature = response.headers.get('x-file-signature');
        const publicKey = response.headers.get('X-Public-Sign');
        const ecryptedKeyHash = response.headers.get('X-Encrypted-key');
        const myPrivateKey = response.headers.get('X-Iv-Key');
        const ivHex = response.headers.get('X-Pr-Key');
        // const keyHex = "5b2d9d2416e9da5de07a0ac6fc24eb3a5a091c4db12a4830b1399c2e26692b2f";
        // const ivHex = '04e1d2654e2ffb612a2e7ca12bc32ff4';

        // Get the ReadableStream from the response
        // const encryptedStream = res.arrayBuffer();
        //
        console.log("signature", signature)
        if (!signature || !publicKey) {
            // Return an error early if there is no signature
            return renderError('No signature found in the response');
        }
        const keyHex = decryptSymmetricKeyAsymmetric(myPrivateKey, ecryptedKeyHash);

        const isVerified = await verifySignature(fileBuffer, signature, publicKey);
        if (!isVerified) {
            // Return an error early if the signature is invalid
            return renderError('The file signature is invalid');
        }

        // Decrypt the file
        const decryptedBuffer = decryptFile(fileBuffer, keyHex, ivHex);

        // Convert the decrypted buffer to base64 for displaying as an image
        const fileBase64 = decryptedBuffer.toString('base64');
        const fileUrl = `data:${contentType};base64,${fileBase64}`; // Adjust for file type if necessary

        return (
            <Box sx={{ textAlign: 'center', padding: '20px' }}>
                <Typography variant="h4">File Viewer</Typography>
                <Box component="img" src={fileUrl} alt="Decrypted file" sx={{ marginTop: '20px', maxWidth: '1200px', maxHeight: "1000px" }} />
            </Box>
        );
    } catch (error) {
        // Return an error early if any other issues arise
        console.log("error", error)
        return renderError('An error occurred while fetching the file');
    }
}

// Utility function to render an error response
function renderError(errorMessage: string) {
    return (
        <Typography variant="h6" color="error">
            Error: {errorMessage}
        </Typography>
    );
}

// Decrypt function using AES-256-CBC
function decryptFile(encryptedBuffer: Buffer, keyHex: string, ivHex: string): Buffer {
    const key = Buffer.from(keyHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    // Decrypt the file
    const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);

    return decrypted;
}


async function verifySignature(
    fileBuffer: Buffer,
    signature: string,
    publicKey: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        try {
            const hash = crypto.createHash('sha256');   // Create the hash object
            const verify = crypto.createVerify('sha256');  // Create the verify object

            // Convert public key from Base64 to Buffer
            const publicKeyBuffer = Buffer.from(publicKey, 'base64');

            // Update both hash and verification with the file buffer
            hash.update(fileBuffer);
            verify.update(fileBuffer);

            // Verify the signature using the public key and base64 signature
            const isVerified = verify.verify({ key: publicKeyBuffer, format: 'der', type: 'spki' }, signature, 'base64');

            resolve(isVerified);  // Return whether the signature is valid
        } catch (err) {
            reject(err);
        }
    });
}
function decryptSymmetricKeyAsymmetric(privateKeyPem: string, encryptedKeyBase64: string): string {
    const decryptedKey = crypto.privateDecrypt(
        privateKeyPem, // Private key in PEM format
        Buffer.from(encryptedKeyBase64, 'base64') // Encrypted key in Base64 format converted to Buffer
    );

    return decryptedKey.toString('hex'); // Return decrypted symmetric key in hex format
}
