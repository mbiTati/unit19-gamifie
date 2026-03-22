public class BSTreeCorrection {
    static class TreeNode {
        int value; TreeNode left, right;
        TreeNode(int v) { this.value = v; }
    }

    static TreeNode insert(TreeNode node, int val) {
        if (node == null) return new TreeNode(val);
        if (val < node.value) node.left = insert(node.left, val);
        else if (val > node.value) node.right = insert(node.right, val);
        return node;
    }

    static void inorder(TreeNode node) {
        if (node == null) return;
        inorder(node.left);
        System.out.print(node.value + " ");
        inorder(node.right);
    }

    static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i]; int j = i - 1;
            while (j >= 0 && arr[j] > key) { arr[j + 1] = arr[j]; j--; }
            arr[j + 1] = key;
        }
    }
}