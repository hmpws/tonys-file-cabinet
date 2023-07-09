import { useNavigate } from "react-router-dom";
import { Button, EmptyState, Page, LegacyCard } from "@shopify/polaris";

export default function LoginSuccess() {
    const navigate = useNavigate();
    return (
        <>
            <Page>
                <LegacyCard sectioned>
                    <EmptyState
                        heading="Success!"
                        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                    >
                        <Button
                            primary
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            Start reading!
                        </Button>
                    </EmptyState>
                </LegacyCard>
            </Page>
        </>
    );
}
