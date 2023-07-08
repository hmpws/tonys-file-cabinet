import { Page, LegacyCard, Button } from "@shopify/polaris";

function App() {
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

export default App;
