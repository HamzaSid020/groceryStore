#include <iostream>
#include <vector>
#include <map>
#include <algorithm>
#include <climits>
#include <set>

using namespace std;

// Structure to represent a point with x and y coordinates
struct Point {
    int x, y;
};

// Function to compute the slope between two points
pair<int, int> computeSlope(const Point& p1, const Point& p2) {
    int dx = p2.x - p1.x;
    int dy = p2.y - p1.y;

    // Handle vertical lines by setting the slope to a special value
    if (dx == 0) {
        return {INT_MAX, 1};
    }

    // Simplify the slope fraction
    int gcd = __gcd(dx, dy);
    return {dx / gcd, dy / gcd};
}

int main() {
    int n;
    cin >> n;

    vector<Point> points(n);

    for (int i = 0; i < n; ++i) {
        cin >> points[i].x >> points[i].y;
    }

    map<pair<int, int>, vector<int>> slopeMap;
    set<set<int>> processedCollinear; // Use a set of sets to store processed collinear triplets

    // Iterate through points and compute/store slopes
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n; ++j) {
            pair<int, int> slope = computeSlope(points[i], points[j]);
            slopeMap[slope].push_back(i);
            slopeMap[slope].push_back(j);
        }
    }

    bool found = false;

    // Iterate through slopes to find collinear points
    for (const auto& entry : slopeMap) {
        const vector<int>& collinearPoints = entry.second;
        int numCollinear = collinearPoints.size();
        if (numCollinear >= 6) {
            set<int> collinearTriplet;
            for (int i = 0; i < numCollinear; ++i) {
                collinearTriplet.insert(collinearPoints[i]);
                if (i % 2 == 1) {
                    if (processedCollinear.find(collinearTriplet) == processedCollinear.end()) {
                        processedCollinear.insert(collinearTriplet);
                        found = true;
                        for (int point : collinearTriplet) {
                            cout << points[point].x << " " << points[point].y << " ";
                        }
                        cout << endl;
                    }
                    collinearTriplet.clear();
                }
            }
        }
    }

    if (!found) {
        cout << "none" << endl;
    }

    return 0;
}