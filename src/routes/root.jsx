import { Page, LegacyCard, Button } from "@shopify/polaris";
export default function Root() {
    return (
        <>
            <Page title="Example app">
                <LegacyCard sectioned>
                    <Button onClick={() => alert("Button clicked!")}>
                        Example button
                    </Button>
                </LegacyCard>
            </Page>
        </>
    );
}
