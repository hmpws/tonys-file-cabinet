import { LegacyCard, EmptyState } from "@shopify/polaris";

export default function Index() {
    return (
        <LegacyCard sectioned>
            <EmptyState
                heading="Select an article from the list on the left!"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
                <p>Nothing to see here!</p>
            </EmptyState>
        </LegacyCard>
    );
}
