// test/ResourceCardDragDrop.test.jsx
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import App from '../src/App.jsx';


const seedResources = (resources = []) => {
    window.localStorage.setItem('learningResources', JSON.stringify(resources));
};

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Helper to get resource card by text
const getResourceCard = (text) => screen.getByText(text).closest('[draggable]');

// Helper to get column by label
const getColumn = (label) => screen.getByTestId(`column-${label}`);

describe('Learning Resource Drag & Drop', () => {
    beforeEach(() => {
        window.localStorage.clear();
        seedResources([
            { id: '1', title: 'Learn React', status: 'to-learn' },
        ]);
    });

    

    it('should persist resources to localStorage after drag and drop', () => {
        render(<App />);
        const resourceCard = getResourceCard('Learn React');
        const nextColumn = getColumn('in-progress');

        // Simulate drag and drop
        fireEvent.dragStart(resourceCard);
        fireEvent.drop(nextColumn);

        // Check localStorage
        const stored = window.localStorage.getItem('learningResources');
        expect(stored).toBeTruthy();
        expect(JSON.parse(stored)).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ status: 'in-progress' })
            ])
        );
    });

    it('should allow dragging resource from one column to another and back', () => {
        render(<App />);
        const resourceCard = getResourceCard('Learn React');
        const nextColumn = getColumn('in-progress');
        const prevColumn = getColumn('to-learn');

        // Drag to next column
        fireEvent.dragStart(resourceCard);
        fireEvent.drop(nextColumn);
        const moved = getResourceCard('Learn React');
        expect(nextColumn).toContainElement(moved);

        // Drag back to previous column
        fireEvent.dragStart(moved);
        fireEvent.drop(prevColumn);
        const returned = getResourceCard('Learn React');
        expect(prevColumn).toContainElement(returned);
    });

    it('should not move resource if dropped outside any column', () => {
        render(<App />);
        const resourceCard = getResourceCard('Learn React');
        const initialColumn = getColumn('to-learn');

        fireEvent.dragStart(resourceCard);
        fireEvent.drop(document.body); // Drop outside

        expect(initialColumn).toContainElement(resourceCard);
    });

    it('should handle empty localStorage gracefully', () => {
        window.localStorage.clear();
        render(<App />);
        const col = screen.getByTestId('column-to-learn');
        expect(col).toBeInTheDocument();

        // no crash, column is empty
        expect(col.querySelectorAll('[draggable]').length).toBe(0);
    });

    it('should not duplicate resources on repeated drag/drop', () => {
        render(<App />);
        const resourceCard = getResourceCard('Learn React');
        const nextColumn = getColumn('in-progress');

        fireEvent.dragStart(resourceCard);
        fireEvent.drop(nextColumn);
        fireEvent.dragStart(resourceCard);
        fireEvent.drop(nextColumn);

        // Should only exist once in the column
        const cards = nextColumn.querySelectorAll('[draggable]');
        const cardTexts = Array.from(cards).map(card => card.textContent);
        expect(cardTexts.filter(t => t.includes('Learn React')).length).toBe(1);
    });
});
