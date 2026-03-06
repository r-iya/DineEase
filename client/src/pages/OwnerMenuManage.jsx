import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'sonner';
import { Upload, Camera, Save, RefreshCw } from 'lucide-react';

const OwnerMenuManage = () => {
    const { id } = useParams();
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [isParsing, setIsParsing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchRestaurant();
    }, [id]);

    const fetchRestaurant = async () => {
        try {
            const res = await api.get(`/restaurants/${id}`);
            setMenuItems(res.data.menu || []);
        } catch (error) {
            toast.error('Failed to load menu');
        } finally {
            setLoading(false);
        }
    };

    const handleAIParse = async () => {
        if (!imageFile) return toast.error('Please select an image first');

        const formData = new FormData();
        formData.append('menuImage', imageFile);

        try {
            setIsParsing(true);
            const res = await api.post('/restaurants/menu/parse', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Append parsed items to current
            setMenuItems([...menuItems, ...res.data.items]);
            toast.success('Menu parsed successfully. Please review and save.');
            setImageFile(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to parse image. Try manual entry.');
        } finally {
            setIsParsing(false);
        }
    };

    const saveMenu = async () => {
        try {
            setIsSaving(true);
            await api.put(`/restaurants/${id}/menu`, { menuItems });
            toast.success('Menu saved successfully!');
        } catch (error) {
            toast.error('Failed to save menu');
        } finally {
            setIsSaving(false);
        }
    };

    const addManualItem = () => {
        setMenuItems([...menuItems, { name: '', price: '' }]);
    };

    const updateItem = (index, field, value) => {
        const updated = [...menuItems];
        updated[index][field] = value;
        setMenuItems(updated);
    };

    const removeItem = (index) => {
        const updated = [...menuItems];
        updated.splice(index, 1);
        setMenuItems(updated);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Menu Management</h1>
            <p className="text-gray-600 mb-8">Upload a picture of your physical menu, or add items manually.</p>

            {/* AI AI Upload Section */}
            <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 mb-8">
                <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2"><Camera /> AI Menu Scanner</h2>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-100 file:text-primary-700
              hover:file:bg-primary-200"
                    />
                    <button
                        onClick={handleAIParse}
                        disabled={isParsing || !imageFile}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 whitespace-nowrap flex items-center gap-2 font-medium transition-all"
                    >
                        {isParsing ? <><RefreshCw className="h-5 w-5 animate-spin" /> Scanning...</> : <><Upload className="h-5 w-5" /> Scan Menu</>}
                    </button>
                </div>
            </div>

            {/* Manual / Editor Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">Menu Items List</h2>
                    <button onClick={addManualItem} className="text-primary-600 font-medium hover:underline text-sm">+ Add Item Manually</button>
                </div>

                {menuItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">No items yet. Scan an image or add manually!</p>
                ) : (
                    <div className="space-y-3 mb-6">
                        {menuItems.map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-center">
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => updateItem(idx, 'name', e.target.value)}
                                    placeholder="Item Name"
                                    className="flex-grow border rounded-md p-2"
                                />
                                <div className="relative w-32">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={item.price}
                                        onChange={(e) => updateItem(idx, 'price', parseFloat(e.target.value))}
                                        placeholder="0.00"
                                        className="w-full border rounded-md p-2 pl-7"
                                    />
                                </div>
                                <button onClick={() => removeItem(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-md font-bold text-xl">&times;</button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-end border-t pt-4">
                    <button
                        onClick={saveMenu}
                        disabled={isSaving}
                        className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? 'Saving...' : <><Save className="h-4 w-4" /> Save Final Menu</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OwnerMenuManage;
