import {
    Button,
    DataTable,
    Page,
    Select,
    TextField
} from '@shopify/polaris';
import React, { useCallback, useState } from 'react';

const CollectionReviewListing = () => {

    const initialRows = [
        ['Emerald Silk Gown', '$875.00', 124689, 140, '$122,500.00'],
        ['Mauve Cashmere Scarf', '$230.00', 124533, 83, '$19,090.00'],
        [
            'Navy Merino Wool Blazer with khaki chinos and yellow belt',
            '$445.00',
            124518,
            32,
            '$14,240.00',
        ],
    ];

    const [sortedRows, setSortedRows] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
    const [selectedPriceFilter, setSelectedPriceFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(2);

    const rows = sortedRows || initialRows;

    const filteredRows = rows.filter(row => {
        const productName = row[0].toLowerCase();
        const searchMatch = productName.includes(searchValue.toLowerCase());

        const categoryMatch =
            selectedCategoryFilter === 'all' ||
            (selectedCategoryFilter === 'gown' && productName.includes('gown')) ||
            (selectedCategoryFilter === 'scarf' && productName.includes('scarf')) ||
            (selectedCategoryFilter === 'blazer' && productName.includes('blazer'));

        const price = parseFloat(row[1].substring(1));
        const priceMatch =
            selectedPriceFilter === 'all' ||
            (selectedPriceFilter === 'low' && price < 300) ||
            (selectedPriceFilter === 'medium' && price >= 300 && price < 500) ||
            (selectedPriceFilter === 'high' && price >= 500);

        return searchMatch && categoryMatch && priceMatch;
    });

    const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

    const paginatedRows = filteredRows.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = useCallback(
        (index, direction) => setSortedRows(sortCurrency(rows, index, direction)),
        [rows],
    );

    const handleSearchChange = useCallback((value) => {
        setSearchValue(value);
        setCurrentPage(1);
    }, []);

    const handleCategoryFilterChange = useCallback((value) => {
        setSelectedCategoryFilter(value);
        setCurrentPage(1);
    }, []);

    const handlePriceFilterChange = useCallback((value) => {
        setSelectedPriceFilter(value);
        setCurrentPage(1);
    }, []);

    const handlePreviousPage = useCallback(() => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }, []);

    const handleNextPage = useCallback(() => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }, [totalPages]);

    function sortCurrency(rows, index, direction) {
        return [...rows].sort((rowA, rowB) => {
            const amountA = parseFloat((rowA[index] || 0).toString().substring(1));
            const amountB = parseFloat((rowB[index] || 0).toString().substring(1));
            return direction === 'descending' ? amountB - amountA : amountA - amountB;
        });
    }

    const categoryOptions = [
        { label: 'All Products', value: 'all' },
        { label: 'Gowns', value: 'gown' },
        { label: 'Scarves', value: 'scarf' },
        { label: 'Blazers', value: 'blazer' }
    ];

    const priceOptions = [
        { label: 'All Prices', value: 'all' },
        { label: 'Under $300', value: 'low' },
        { label: '$300 - $500', value: 'medium' },
        { label: 'Over $500', value: 'high' }
    ];

    return (
        <Page fullWidth title="Collection Reviews">

            <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "100%" }}>
                    <TextField
                        label="Search products"
                        value={searchValue}
                        onChange={handleSearchChange}
                        placeholder="Search by product name"
                    />
                </div>
                <div style={{ width: "100%" }}>
                    <Select
                        label="Category"
                        options={categoryOptions}
                        value={selectedCategoryFilter}
                        onChange={handleCategoryFilterChange}
                    />
                </div>
                <div style={{ width: "100%" }}>
                    <Select
                        label="Price Range"
                        options={priceOptions}
                        value={selectedPriceFilter}
                        onChange={handlePriceFilterChange}
                    />
                </div>
            </div>

            <DataTable
                columnContentTypes={[
                    'text',
                    'numeric',
                    'numeric',
                    'numeric',
                    'numeric',
                ]}
                headings={[
                    'Product',
                    'Price',
                    'SKU Number',
                    'Net quantity',
                    'Net sales',
                ]}
                rows={paginatedRows}
                totals={['', '', '', 255, '$155,830.00']}
                sortable={[false, true, false, false, true]}
                defaultSortDirection="descending"
                initialSortColumnIndex={4}
                onSort={handleSort}
                footerContent={
                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            {`Showing ${Math.min(filteredRows.length, 1 + (currentPage - 1) * itemsPerPage)}-${Math.min(filteredRows.length, currentPage * itemsPerPage)} of ${filteredRows.length} results`}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <div style={{ padding: '0 8px', display: 'flex', alignItems: 'center' }}>
                                {`Page ${currentPage} of ${totalPages || 1}`}
                            </div>
                            <Button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages || totalPages === 0}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                }
            />
        </Page>
    );
};

export default CollectionReviewListing;